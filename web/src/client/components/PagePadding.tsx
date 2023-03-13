type PagePaddingProps = {
  children: React.ReactNode;
};
export const PagePadding: React.FC<PagePaddingProps> = ({ children }) => {
  return (
    <div>
      <div className="m-auto max-w-6xl px-4 md:px-8">{children}</div>
    </div>
  );
};
