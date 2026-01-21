import { useState, useRef, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import "../styles/CourseEdit.css";
import trashIcon from "../assets/trash-can-solid-full.svg";

import TheorySlide from "../components/TheorySlide.jsx";
import ProjectSlide from "../components/ProjectSlide";
import QuizSlide from "../components/QuizSlide";
import ImagePreview from "../components/ImagePreview.jsx";
import { createCourse, getCourseById, updateCourse } from "../components/ApiRequest.jsx";

const CourseEdit = ({ mode = "create" }) => {
    const { id } = useParams();

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
    const navigate = useNavigate();

    useEffect(() => {
        if (mode === "edit" && id) {
            const fetchCourse = async () => {
                try {
                    const res = await getCourseById(id);
                    const data = res.data;

                    setConfig({
                        page: 0,
                        courseTitle: data.title,
                        courseDescription: data.description,
                        price: data.price || "",
                        demoVideo: data.demo_video ? { file: null, preview: data.demo_video } : null,
                        demoImgs: [
                            data.demo_img1 ? { file: null, preview: data.demo_img1 } : null,
                            data.demo_img2 ? { file: null, preview: data.demo_img2 } : null,
                            data.demo_img3 ? { file: null, preview: data.demo_img3 } : null,
                        ]
                    });

                    const slidesTransformed = (data.slides || []).map(slide => ({
                        id: slide.id,
                        page: slide.page,
                        type: slide.type,
                        title: slide.title,
                        blocks: (slide.blocks || []).map(block => {
                            if (block.block_type === "quiz-question") {
                                return {
                                    type: "quiz-question",
                                    data: block.quiz_data,
                                    id: block.id
                                };
                            } else {
                                return {
                                    type: block.block_type,
                                    value: block.value ?? "",
                                    id: block.id
                                };
                            }
                        }),
                    }));

                    setSlides(slidesTransformed);

                    const maxPage = Math.max(0, ...(data.slides?.map(s => s.page) || [0]));
                    nextIdRef.current = maxPage + 1;

                    setPriceType(data.price && data.price !== "0.00" ? "paid" : "free");

                } catch (err) {
                    console.error("Failed to load course for editing:", err);
                    alert("Failed to load course for editing");
                }
            };

            void fetchCourse();
        }
    }, [mode, id]);

    const addSlideTemplate = (type) => {
        const newPage = nextIdRef.current++;

        let slide = {
            page: newPage,
            type,
            title: "",
            blocks: [],
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

        if (field === "demoImgs") {
            setConfig(prev => {
                const imgs = [...prev.demoImgs];

                imgs[index] = {
                    file,
                    preview: URL.createObjectURL(file),
                };

                return { ...prev, demoImgs: imgs };
            })
        } else if (field === "demoVideo") {
            const preview = URL.createObjectURL(file);
            setConfig(prev => ({ ...prev, demoVideo: { file, preview } }));
        } else {
            updateActivePage(field, file, index);
        }
    };

    const submitCourse = async () => {
        const formData = new FormData();

        formData.append("title", config.courseTitle);
        formData.append("description", config.courseDescription);
        formData.append("price", priceType === "paid" ? config.price : "0");

        if (config.demoVideo?.file) {
            formData.append("demo_video", config.demoVideo.file);
        }

        config.demoImgs.forEach((img, idx) => {
            if (img?.file) {
                formData.append(`demo_img${idx + 1}`, img.file);
            }
        });

        const slidesPayload = slides.map(slide => ({
            page: slide.page,
            type: slide.type,
            title: slide.title,
            blocks: slide.blocks.map((block, index) => {
                if (block.type === "quiz-question") {
                    return {
                        block_type: "quiz-question",
                        order: index,
                        value: null,
                        quiz_data: block.data
                    };
                } else {
                    return {
                        block_type: block.type,
                        order: index,
                        value: block.value ?? null,
                        quiz_data: null
                    };
                }
            })
        }));

        formData.append("slides", JSON.stringify(slidesPayload));

        console.log("FormData to be sent:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            if (mode === "edit" && id) {
                await updateCourse(id, formData);
            } else {
                await createCourse(formData);
            }

            navigate("/dashboard/instructor/overview");

        } catch (err) {
            console.error(err);
            alert(mode === "edit" ? "Course update failed" : "Course creation failed");
        }
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
                                    className="delete-btn-red"
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

                        <button
                            className="upload-course-btn add-slide-btn"
                            onClick={submitCourse}
                        >
                            {mode === "edit" ? "Update Course" : "Upload Course"}
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
                                    <p>Course Demo Video:</p>
                                    <label className="cb-file-input">
                                        Upload Course Demo Video
                                        <input
                                            className="file-upload-btn"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) =>
                                                handleFileChange(e, "demoVideo")
                                            }
                                        />
                                    </label>

                                    {config.demoVideo && (
                                        <div className="video-preview">
                                            <video
                                                src={config.demoVideo.preview}
                                                controls
                                                width="400"
                                                style={{ marginTop: "10px", borderRadius: "8px" }}
                                            />
                                            <p>
                                                {config.demoVideo.file ?
                                                    config.demoVideo.file.name :
                                                    config.demoVideo.preview.split('/').pop()
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="media-upload">
                                    <p>Course Demo Images (max 3):</p>
                                    {config.demoImgs.map((img, idx) => (
                                        <div key={idx} className="cb-file-block">
                                            <ImagePreview
                                                src={img?.preview || img}
                                                alt={`Demo image ${idx + 1}`}
                                                fileName={img?.file?.name}
                                            />

                                            <label className="cb-file-input">
                                                {img ? "Change Image" : `Upload Image ${idx + 1}`}
                                                <input
                                                    className="file-upload-btn"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, "demoImgs", idx)}
                                                />
                                            </label>
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
                                            type="text"
                                            inputMode="decimal"
                                            pattern="^\d*\.?\d*$"
                                            placeholder="Course price"
                                            value={config.price}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    updateActivePage("price", value);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {renderActiveSlideEditor()}
                </div>
            </div>
        </div>
    );
};

export default CourseEdit;
