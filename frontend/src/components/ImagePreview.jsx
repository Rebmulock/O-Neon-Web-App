const ImagePreview = ({ src, alt = "", fileName }) => {
    if (!src) return null;

    return (
        <div className="cb-file-preview">
            <img
                src={src}
                alt={alt}
                className="cb-file-thumbnail"
            />
            {fileName && (
                <span className="cb-file-name">{fileName}</span>
            )}
        </div>
    );
};

export default ImagePreview;
