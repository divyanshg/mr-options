import Image from 'next/image';

const Header = ({}) => {
  return (
    <nav className="py-4 border-b border-gray-200 navbar navbar-expand-lg navbar-light bg-light h-fit">
      <div className="container">
        <div className="flex flex-row items-center justify-center w-full">
          <Image
            src="https://manavrachna.edu.in/wp-content/uploads/2023/04/mrnaac-jpg.jpg"
            width={400}
            height={100}
            alt="Manav Rachna"
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
