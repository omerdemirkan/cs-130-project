import dynamic from "next/dynamic";

type HeaderProps = {
  onChange: (value: string) => void;
  value: string;
};

export const Header: React.FC<HeaderProps> = ({ value, onChange }) => {
  return (
    <div id="header-wrapper" className="h-screen">

    </div>
  );
};
