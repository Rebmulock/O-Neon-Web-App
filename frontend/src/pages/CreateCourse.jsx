import { useState, useRef, useEffect } from "react";
import "../styles/CreateCourse.css";
import trashIcon from "../assets/trash-can-solid-full.svg";

const CreateCourse = () => {
    const [slides, setSlides] = useState([
        {
            id: 1,
            title: "",
            description: "",
            image: null
        }
    ]);
    const [activeSlideId, setActiveSlideId] = useState(1);
    const bottomRef = useRef(null);
    const nextIdRef = useRef(2)

    const activeSlide = slides.find(s => s.id === activeSlideId);

    const addSlide = () => {
        const newId = nextIdRef.current++;

        setSlides(prev => [
            ...prev,
            {
                id: newId,
                title: "",
                description: "",
                image: null
            }
        ]);

        setActiveSlideId(newId);
    };

    const deleteSlide = (id) => {
        setSlides(prevSlides => {
            if (prevSlides.length === 1) {
                return prevSlides;
            }

            const newSlides = prevSlides.filter(slide => slide.id !== id);

            if (id === activeSlideId) {
                const deletedIndex = prevSlides.findIndex(slide => slide.id === id);

                const nextSlide =
                    newSlides[deletedIndex] ||
                    newSlides[deletedIndex - 1];

                setActiveSlideId(nextSlide.id);
            }

            return newSlides;
        })
    }

    const updateActiveSlide = (field, value) => {
        setSlides(prev =>
            prev.map(slide =>
                slide.id === activeSlideId
                    ? { ...slide, [field]: value }
                    : slide
            )
        );
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [slides.length]);

    return (
        // ICC = Instructor Create Course
        <div className="icc-container">
            <div className="icc-content">
                <div className="icc-slides-panel">
                    <div className="slides-list">
                        {slides.map(slide => (
                            <div
                                key={slide.id}
                                className={`slide-thumb ${
                                    slide.id === activeSlideId ? "active" : ""
                                }`}
                                onClick={() => setActiveSlideId(slide.id)}
                            >
                                <div className="slide-thumb-title">
                                    {slide.title || `Chapter ${slide.id}`}
                                </div>

                                {slide.id === activeSlideId && (
                                    <button
                                        className="delete-slide-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSlide(slide.id);
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
                        placeholder="Chapter title..."
                        value={activeSlide.title || `Chapter ${activeSlide.id}`}
                        onChange={(e) =>
                            updateActiveSlide("title", e.target.value)
                        }
                    />

                    <textarea
                        className="editor-description"
                        placeholder="Chapter description..."
                        value={activeSlide.description}
                        onChange={(e) =>
                            updateActiveSlide("description", e.target.value)
                        }
                    />

                    <div className="editor-image">
                        <span>Drop image here or click to upload</span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateCourse;