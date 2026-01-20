import BlockEditor from "./BlockEditor";
import "../styles/CourseSlides.css"

const TheorySlide = ({ data, onChange }) => {
    const allowedTypes = ["heading", "description", "image"];

    return (
        <>
            <input
                className="editor-title"
                placeholder="Theory title"
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

export default TheorySlide;