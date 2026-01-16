import { useState, useRef, useEffect } from "react";
import "../styles/CreateCourse.css";
import trashIcon from "../assets/trash-can-solid-full.svg";

const CreateCourse = () => {
    const [config, setConfig] = useState({
        page: 0,
        courseTitle: "",
        courseDescription: "",
        priceType: "free",
        price: 0,
        demoVideo: null,
        demoImgs: [null, null, null],
    });

    const [slides, setSlides] = useState([
        {
            page: 1,
            title: "",
            description: "",
            image: null
        }
    ]);

    const [activeSlidePage, setActiveSlidePage] = useState(0);
    const bottomRef = useRef(null);
    const nextIdRef = useRef(2);

    const activePageData = activeSlidePage === 0 ? config : slides.find(s => s.page === activeSlidePage);

    const addSlide = () => {
        const newPage = nextIdRef.current++;
        setSlides(prev => [
            ...prev,
            {
                page: newPage,
                title: "",
                description: "",
                image: null
            }
        ]);
        setActiveSlidePage(newPage);
    };

    const deleteSlide = (page) => {
        setSlides(prevSlides => {
            if (prevSlides.length === 1) return prevSlides;
            const newSlides = prevSlides.filter(slide => slide.page !== page);
            if (page === activeSlidePage) {
                const deletedIndex = prevSlides.findIndex(slide => slide.page === page);
                const nextSlide =
                    newSlides[deletedIndex] ||
                    newSlides[deletedIndex - 1];
                setActiveSlidePage(nextSlide.page);
            }
            return newSlides;
        });
    };

    const updateActivePage = (field, value, index = null) => {
        if (activeSlidePage === 0) {
            if (field === "demoImgs" && index !== null) {
                setConfig(prev => {
                    const newImgs = [...prev.demoImgs];
                    newImgs[index] = value;
                    return { ...prev, demoImgs: newImgs };
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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [slides.length]);

    const handleFileChange = (e, field, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        updateActivePage(field, file, index);
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
                                {config.courseTitle || `New Course`}
                            </div>
                        </div>
                        {slides.map(slide => (
                            <div
                                key={slide.page}
                                className={`slide-thumb ${slide.page === activeSlidePage ? "active" : ""}`}
                                onClick={() => setActiveSlidePage(slide.page)}
                            >
                                <div className="slide-thumb-title">
                                    {slide.title || `Chapter ${slide.page}`}
                                </div>
                                {slide.page === activeSlidePage && slides.length > 1 && (
                                    <button
                                        className="delete-slide-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSlide(slide.page);
                                        }}
                                    >
                                        <img src={trashIcon} alt="delete slide" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="add-slide-btn"
                            onClick={addSlide}
                        >
                            + Add Slide
                        </button>
                        <div ref={bottomRef} />
                    </div>
                </div>
                <div className="icc-editor">
                    <input
                        className="editor-title"
                        type="text"
                        placeholder={activeSlidePage === 0 ? "Course title..." : "Chapter title..."}
                        value={activePageData.courseTitle ?? activePageData.title ?? ""}
                        onChange={(e) =>
                            updateActivePage(
                                activeSlidePage === 0 ? "courseTitle" : "title",
                                e.target.value
                            )
                        }
                    />
                    <textarea
                        className="editor-description"
                        placeholder={activeSlidePage === 0 ? "Course description..." : "Chapter description..."}
                        value={activePageData.courseDescription ?? activePageData.description ?? ""}
                        onChange={(e) =>
                            updateActivePage(
                                activeSlidePage === 0 ? "courseDescription" : "description",
                                e.target.value
                            )
                        }
                    />
                    {activeSlidePage === 0 && (
                        <div className="editor-media">
                            <div className="media-upload">
                                <label>
                                    Course Demo Video:
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, "demoVideo")}
                                    />
                                </label>
                                {config.demoVideo && <p>{config.demoVideo.name}</p>}
                            </div>
                            <div className="media-upload">
                                <p>Course Demo Images (max 3):</p>
                                {config.demoImgs.map((img, idx) => (
                                    <label key={idx}>
                                        Image {idx + 1}:
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "demoImgs", idx)}
                                        />
                                        {img && <p>{img.name}</p>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeSlidePage !== 0 && (
                        <div className="editor-image">
                            <span>Drop chapter image here or click to upload</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;