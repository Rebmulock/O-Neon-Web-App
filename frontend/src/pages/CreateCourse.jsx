import { useState, useRef, useEffect } from "react";
import "../styles/CreateCourse.css";
import trashIcon from "../assets/trash-can-solid-full.svg";

import TheorySlide from "../components/TheorySlide.jsx";
import ProjectSlide from "../components/ProjectSlide";
import QuizSlide from "../components/QuizSlide";

const CreateCourse = () => {
    const [config, setConfig] = useState({
        page: 0,
        courseTitle: "",
        courseDescription: "",
        price: "",
        demoVideo: null,
        demoImgs: [null, null, null],
    });
    const [priceType, setPriceType] = useState("free");
    const [slides, setSlides] = useState([]);
    const [activeSlidePage, setActiveSlidePage] = useState(0);
    const [showTemplateChooser, setShowTemplateChooser] = useState(false);

    const bottomRef = useRef(null);
    const nextIdRef = useRef(1);

    const activePageData =
        activeSlidePage === 0
            ? config
            : slides.find(s => s.page === activeSlidePage);

    const addSlideTemplate = (type) => {
        const newPage = nextIdRef.current++;

        let slide = {
            page: newPage,
            type,
            title: "",
            description: "",
            image: null,
        };

        if (type === "Theory") {
            slide.title = "New Theory";
        }
        if (type === "Project") {
            slide.title = "New Project";
        }
        if (type === "Quiz") {
            slide.title = "New Quiz";
        }

        setSlides(prev => [...prev, slide]);
        setActiveSlidePage(newPage);
        setShowTemplateChooser(false);
    };

    const deleteSlide = (page) => {
        setSlides(prev => {
            const filtered = prev.filter(s => s.page !== page);

            if (page === activeSlidePage) {
                setActiveSlidePage(filtered[0]?.page ?? 0);
            }

            return filtered;
        });
    };

    const updateActivePage = (field, value, index = null) => {
        if (activeSlidePage === 0) {
            if (field === "demoImgs" && index !== null) {
                setConfig(prev => {
                    const imgs = [...prev.demoImgs];
                    imgs[index] = value;
                    return { ...prev, demoImgs: imgs };
                });
            } else {
                setConfig(prev => ({ ...prev, [field]: value }));
            }
        } else {
            setSlides(prev =>
                prev.map(slide =>
                    slide.page === activeSlidePage
                        ? { ...slide, [field]: value }
                        : slide
                )
            );
        }
    };

    const handleFileChange = (e, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        updateActivePage(field, file, index);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [slides.length]);

    const renderActiveSlideEditor = () => {
        if (activeSlidePage === 0) return null;

        const slide = slides.find(s => s.page === activeSlidePage);
        if (!slide) return null;

        const props = { data: slide, onChange: updateActivePage };

        if (slide.type === "Theory") return <TheorySlide {...props} />;
        if (slide.type === "Project") return <ProjectSlide {...props} />;
        if (slide.type === "Quiz") return <QuizSlide {...props} />;
        return null;
    };

    return (
        <div className="icc-container">
            <div className="icc-content">
                <div className="icc-slides-panel">
                    <div className="slides-list">
                        <div
                            className={`slide-thumb ${activeSlidePage === 0 ? "active" : ""}`}
                            onClick={() => setActiveSlidePage(0)}
                        >
                            <div className="slide-thumb-title">
                                {config.courseTitle || "New Course"}
                            </div>
                        </div>

                        {slides.map(slide => (
                            <div
                                key={slide.page}
                                className={`slide-thumb ${slide.page === activeSlidePage ? "active" : ""}`}
                                onClick={() => setActiveSlidePage(slide.page)}
                            >
                                <div className="slide-thumb-title">
                                    {slide.title}
                                </div>

                                <button
                                    className="delete-slide-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSlide(slide.page);
                                    }}
                                >
                                    <img src={trashIcon} alt="delete" />
                                </button>
                            </div>
                        ))}

                        <button
                            className="add-slide-btn"
                            onClick={() => setShowTemplateChooser(true)}
                        >
                            + Add Slide
                        </button>

                        <div ref={bottomRef} />
                    </div>

                    {showTemplateChooser && (
                        <div className="template-chooser">
                            <button onClick={() => addSlideTemplate("Theory")}>Theory</button>
                            <button onClick={() => addSlideTemplate("Project")}>Project</button>
                            <button onClick={() => addSlideTemplate("Quiz")}>Quiz</button>
                            <button onClick={() => setShowTemplateChooser(false)}>Cancel</button>
                        </div>
                    )}
                </div>

                <div className="icc-editor">
                    {activeSlidePage === 0 && (
                        <>
                            <input
                                className="editor-title"
                                type="text"
                                placeholder="Course title..."
                                value={config.courseTitle}
                                onChange={(e) =>
                                    updateActivePage("courseTitle", e.target.value)
                                }
                            />

                            <textarea
                                className="editor-description"
                                placeholder="Course description..."
                                value={config.courseDescription}
                                onChange={(e) =>
                                    updateActivePage("courseDescription", e.target.value)
                                }
                            />

                            <div className="editor-media">
                                <div className="media-upload">
                                    <div>
                                        Course Demo Video:
                                        <input
                                            className="file-upload-btn"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) =>
                                                handleFileChange(e, "demoVideo")
                                            }
                                        />
                                    </div>
                                    {config.demoVideo && <p>{config.demoVideo.name}</p>}
                                </div>

                                <div className="media-upload">
                                    <p>Course Demo Images (max 3):</p>
                                    {config.demoImgs.map((img, idx) => (
                                        <div key={idx}>
                                            Image {idx + 1}:
                                            <input
                                                className="file-upload-btn"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(e, "demoImgs", idx)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="editor-pricing">
                                    <label className="paid-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={priceType === "paid"}
                                            onChange={(e) => {
                                                const isPaid = e.target.checked;
                                                setPriceType(isPaid ? "paid" : "free");

                                                if (!isPaid) {
                                                    updateActivePage("price", "");
                                                }
                                            }}
                                        />
                                        Paid
                                    </label>

                                    {priceType === "paid" && (
                                        <input
                                            className="editor-price-input"
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder="Course price"
                                            value={config.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || Number(value) >= 0) {
                                                    updateActivePage("price", value);
                                                }
                                            }}
                                        />
                                    )}
                                </div>

                                <button onClick={() => console.log(config)}>
                                    Click
                                </button>
                            </div>
                        </>
                    )}

                    {renderActiveSlideEditor()}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
