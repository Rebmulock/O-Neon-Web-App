const QuizSlide = ({ data, onChange }) => (
    <>
        <input
            className="editor-title"
            type="text"
            placeholder="Quiz title"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
        />
        <textarea
            className="editor-description"
            placeholder="Quiz description"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
        />
    </>
);

export default QuizSlide;