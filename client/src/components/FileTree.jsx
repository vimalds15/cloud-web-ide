const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
    >
      <p className="filename">
        {fileName !== "/" &&
          (isDir ? (
            <img
              src="https://img.icons8.com/?size=256&id=WWogVNJDSfZ5&format=png"
              width={15}
              height={15}
              style={{ objectFit: "contain" }}
            />
          ) : ((fileName?.split('.')[1]==='js') &&
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
              width={15}
              height={13}
              style={{ objectFit: "contain" }}
            />
          ))}{" "}
        {fileName}
      </p>
      {nodes && fileName !== "node_modules" && (
        <ul style={{ marginLeft: "15px" }}>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};

export default FileTree;
