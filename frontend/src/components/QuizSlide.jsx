import BlockEditor from "./BlockEditor";
import "../styles/CourseSlides.css"

const QuizSlide = ({ data, onChange }) => {
    const allowedTypes = ["heading", "quiz-question"];

    return (
        <>
            <input
                className="editor-title"
                placeholder="Quiz title"
                value={data.title}
                onChange={e => onChange("title", e.target.value)}
            />
            <BlockEditor
                blocks={data.blocks || []}
                allowedTypes={allowedTypes}
                onChange={blocks => onChange("blocks", blocks)}
            />
        </>
    );
};

export default QuizSlide;