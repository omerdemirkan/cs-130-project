import dynamic from "next/dynamic";
import { Breadcrumb } from "antd";
import { signOut } from "next-auth/react";

type HeaderProps = {
  username: string | null;
  image: string | null;
  itemList: any;
};

export const Header: React.FC<HeaderProps> = ({
  username,
  image,
  itemList,
}) => {
  const head = [
    {
      title: username,
      menu: {
        items: [
          {
            key: "1",
            label: <span onClick={() => void signOut()}>Sign out</span>,
          },
        ],
      },
    },
  ];
  const realList = head.concat(itemList);
  return (
    <div id="header-wrapper" className="flex h-16 items-center bg-white">
      <img className="mr-3 h-8 w-8 rounded-full" src={image as string} />
      <Breadcrumb items={realList} />
    </div>
  );
};
