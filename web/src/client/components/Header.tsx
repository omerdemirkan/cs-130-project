import dynamic from "next/dynamic";
import { Breadcrumb } from 'antd';
import { signOut } from 'next-auth/react';

type HeaderProps = {
  username: string | null;
  image: string | null;
  itemList: any;
};

export const Header: React.FC<HeaderProps> = ({ username, image, itemList }) => {
  const head = [
    {
      title: username,
      menu: { 
        items:
          [
            {
              key: '1',
              label: (
              <span
                onClick={() => void signOut()}
              >
                Sign out
              </span>)
            }
          ]
      }
    }
  ]
  const realList = head.concat(itemList);
  console.log(realList);
  return (
    <div id="header-wrapper" className="flex w-screen bg-white items-center h-16">
      <img className="rounded-full h-8 w-8 mr-3 ml-3" src={image as string}/>
      <Breadcrumb
        items={realList}
      />
    </div>
  );
};
