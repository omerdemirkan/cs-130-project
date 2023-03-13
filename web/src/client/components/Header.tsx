import dynamic from "next/dynamic";
import { Breadcrumb } from 'antd';

type HeaderProps = {
  username: string | null;
  image: string | null;
  itemList: any;
};

export const Header: React.FC<HeaderProps> = ({ username, image, itemList }) => {
  const userProfile = 
    <p className="flex ml-4 my-0 mb-0 text-start items-center">
      <img className="rounded-full h-8 w-8 mr-3" src={image as string}/>
      <p>{username}</p>
    </p>;
  const head = [{"title":userProfile}]
  const realList = head.concat(itemList);
  return (
    <div id="header-wrapper" className="w-screen bg-white items-center">
      <Breadcrumb
        items={realList}
      />
    </div>
  );
};
