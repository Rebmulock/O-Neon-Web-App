const ProjectSlide = ({ data, onChange }) => (
    <>
        <input
            className="editor-title"
            type="text"
            placeholder="Project title"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
        />
        <textarea
            className="editor-description"
            placeholder="Project description"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
        />
    </>
);

export default ProjectSlide;