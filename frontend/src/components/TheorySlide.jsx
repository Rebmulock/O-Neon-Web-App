const TheorySlide = ({ data, onChange }) => (
    <>
        <input
            className="editor-title"
            type="text"
            placeholder="Theory title"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
        />
        <textarea
            className="editor-description"
            placeholder="Theory content"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
        />
    </>
);

export default TheorySlide;