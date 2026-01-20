import BlockEditor from "./BlockEditor";
import "../styles/CourseSlides.css"

const ProjectSlide = ({ data, onChange }) => {
    const allowedTypes = ["heading", "description", "image", "file"];

    return (
        <>
            <input
                className="editor-title"
                placeholder="Project title"
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

export default ProjectSlide;