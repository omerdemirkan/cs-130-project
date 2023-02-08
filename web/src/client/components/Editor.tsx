import dynamic from "next/dynamic";

const AceEditor = dynamic(
  () => {
    const component = import("react-ace");
    require("ace-builds/src-noconflict/ace");

    require("ace-builds/src-noconflict/mode-sparql");

    require("ace-builds/src-noconflict/theme-textmate");

    require("ace-builds/src-noconflict/keybinding-vim");
    require("ace-builds/src-noconflict/keybinding-vscode");
    require("ace-builds/src-noconflict/keybinding-emacs");
    return component;
  },
  { ssr: false, loading: () => <p>Loading</p> }
);

type EditorProps = {
  onChange: (value: string) => void;
  value: string;
};

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <AceEditor
      name="sparql_editor"
      mode="sparql"
      theme="textmate"
      value={value}
      onChange={onChange}
      editorProps={{}}
      setOptions={{}}
    />
  );
};
