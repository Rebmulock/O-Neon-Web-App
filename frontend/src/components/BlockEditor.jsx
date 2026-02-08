import trashIcon from "../assets/trash-can-solid-full.svg";
import { useState } from "react";
import ImagePreview from "./ImagePreview.jsx";

const BlockEditor = ({ blocks = [], allowedTypes = [], onChange }) => {
    const [showAddMenu, setShowAddMenu] = useState(false);

    const addBlock = (type) => {
        let newBlock;

        if (type === "quiz-question") {
            newBlock = {
                id: crypto.randomUUID(),
                type,
                quiz_data: {
                    question: "",
                    answers: ["", "", "", ""],
                    correctIndex: null,
                },
            };
        } else {
            newBlock = {
                id: crypto.randomUUID(),
                type,
                value: type === "image" || type === "file" ? null : "",
                ...(type === "file" ? { fileFile: null } : {}),
                ...(type === "image" ? { imageFile: null, preview: "" } : {}),
            };
        }

        onChange([...blocks, newBlock]);
    };

    const updateBlock = (id, newData) => {
        onChange(
            blocks.map((b) => {
                if (b.id !== id) return b;

                if (b.type === "quiz-question") {
                    return { ...b, quiz_data: newData };

                }

                if (b.type === "image") {
                    return { ...b, imageFile: newData.imageFile, preview: newData.preview };
                }

                return { ...b, value: newData };
            })
        );
    };

    const removeBlock = (id) => {
        onChange(blocks.filter((b) => b.id !== id));
    };

    return (
        <div className="block-editor">
            {blocks.map((block) => (
                <div key={block.id} className="content-block">
                    {block.type === "heading" && (
                        <input
                            className="cb-text cb-heading"
                            placeholder="Heading..."
                            value={block.value}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                        />
                    )}

                    {block.type === "description" && (
                        <textarea
                            className="cb-text cb-description"
                            placeholder="Description..."
                            value={block.value}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                        />
                    )}

                    {block.type === "image" && (
                        <div className="cb-file-block">
                            <ImagePreview
                                src={block.preview || block.imageFile}
                                alt="Uploaded image preview"
                                fileName={block.value?.file?.name}
                            />

                            <label className="cb-file-input">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const imageFile = e.target.files[0];
                                        if (imageFile) {
                                            const preview = URL.createObjectURL(imageFile);
                                            updateBlock(block.id, { imageFile, preview });
                                        }
                                    }}
                                />
                                {block.value?.file ? "Change Image" : "Upload Image"}
                            </label>
                        </div>
                    )}


                    {block.type === "file" && (
                        <div className="cb-file-block">
                            {block.value &&
                                <p className="file-name">
                                    {typeof block.value === "string"
                                        ? block.value.split("/").pop()
                                        : block.value.name}
                                </p>}

                            <label className="cb-file-input">
                                <input
                                    type="file"
                                    accept=".txt,.doc,.docx"
                                    onChange={(e) => updateBlock(block.id, e.target.files[0])}
                                />
                                {block.value ? "Change Project Document" : "Upload Project Document"}
                            </label>
                        </div>
                    )}


                    {block.type === "quiz-question" && (
                        <div className="quiz-question-block">
                            <input
                                className="cb-text"
                                placeholder="Question"
                                value={block.quiz_data.question}
                                onChange={(e) =>
                                    updateBlock(block.id, { ...block.quiz_data, question: e.target.value })
                                }
                            />
                            {block.quiz_data.answers.map((ans, idx) => (
                                <div key={idx}>
                                    <input
                                        className="cb-text quiz-answer"
                                        placeholder={`Answer ${idx + 1}`}
                                        value={ans}
                                        onChange={(e) => {
                                            const newAnswers = [...block.quiz_data.answers];
                                            newAnswers[idx] = e.target.value;
                                            updateBlock(block.id, { ...block.quiz_data, answers: newAnswers });
                                        }}
                                    />

                                    <label>
                                        <input
                                            type="radio"
                                            name={`correct-${block.id}`}
                                            checked={block.quiz_data.correctIndex === idx}
                                            onChange={() =>
                                                updateBlock(block.id, { ...block.quiz_data, correctIndex: idx })
                                            }
                                        />

                                        <span className={
                                            block.quiz_data.correctIndex === idx
                                                ? "quiz-radio correct"
                                                : "quiz-radio incorrect"
                                            }
                                        >
                                            {block.quiz_data.correctIndex === idx ? "Marked as Correct" : null}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="delete-btn-red"
                        onClick={() => removeBlock(block.id)}
                    >
                        <img src={trashIcon} alt="delete" />
                    </button>
                </div>
            ))}

            <div className="add-block-container" onClick={() => setShowAddMenu(true)}>
                +
            </div>

            {showAddMenu && (
                <div
                    className="add-block-modal"
                    onClick={() => setShowAddMenu(false)}
                >
                    <div
                        className="add-block-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {allowedTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    addBlock(type);
                                    setShowAddMenu(false);
                                }}
                            >
                                Add {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}

                        <button
                            className="cancel-btn"
                            onClick={() => setShowAddMenu(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockEditor;