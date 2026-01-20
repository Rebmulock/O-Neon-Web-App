import trashIcon from "../assets/trash-can-solid-full.svg";
import { useState } from "react";

const BlockEditor = ({ blocks = [], allowedTypes = [], onChange }) => {
    const [showAddMenu, setShowAddMenu] = useState(false);

    const addBlock = (type) => {
        let newBlock;

        if (type === "quiz-question") {
            newBlock = {
                id: crypto.randomUUID(),
                type,
                data: {
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
            };
        }

        onChange([...blocks, newBlock]);
    };

    const updateBlock = (id, newData) => {
        onChange(
            blocks.map((b) =>
                b.id === id
                    ? {
                          ...b,
                          ...(b.type === "quiz-question" ? { data: newData } : { value: newData }),
                      }
                    : b
            )
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
                            {block.value?.file && (
                                <div className="cb-file-preview">
                                    {block.value?.preview && (
                                        <img
                                            src={block.value.preview}
                                            alt="thumbnail"
                                            className="cb-file-thumbnail"
                                        />
                                    )}
                                    <span className="cb-file-name">{block.value.file.name}</span>
                                </div>
                            )}

                            <label className="cb-file-input">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const preview = URL.createObjectURL(file);
                                            updateBlock(block.id, { file, preview }); // uložíme do value
                                        }
                                    }}
                                />
                                {block.value?.file ? "Change Image" : "Upload Image"}
                            </label>
                        </div>
                    )}


                    {block.type === "file" && (
                         <label className="cb-file-input">
                            <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            onChange={(e) => updateBlock(block.id, e.target.files[0])}
                            />
                            Upload Project Document
                        </label>
                    )}

                    {block.type === "quiz-question" && (
                        <div className="quiz-question-block">
                            <input
                                className="cb-text"
                                placeholder="Question"
                                value={block.data.question}
                                onChange={(e) =>
                                    updateBlock(block.id, { ...block.data, question: e.target.value })
                                }
                            />
                            {block.data.answers.map((ans, idx) => (
                                <div key={idx}>
                                    <input
                                        className="cb-text quiz-answer"
                                        placeholder={`Answer ${idx + 1}`}
                                        value={ans}
                                        onChange={(e) => {
                                            const newAnswers = [...block.data.answers];
                                            newAnswers[idx] = e.target.value;
                                            updateBlock(block.id, { ...block.data, answers: newAnswers });
                                        }}
                                    />

                                    <label>
                                        <input
                                            type="radio"
                                            name={`correct-${block.id}`}
                                            checked={block.data.correctIndex === idx}
                                            onChange={() =>
                                                updateBlock(block.id, { ...block.data, correctIndex: idx })
                                            }
                                        />

                                        <span className={
                                            block.data.correctIndex === idx
                                                ? "quiz-radio correct"
                                                : "quiz-radio incorrect"
                                            }
                                        >
                                            {block.data.correctIndex === idx ? "Correct" : "Incorrect"}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="delete-slide-btn"
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