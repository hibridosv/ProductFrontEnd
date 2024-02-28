import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai"


export function HeaderSkeleton() {

  return (
    <header className="bg-white">
    <nav className="w-full mx-auto flex items-center justify-between p-2 bg-gray-600" aria-label="Global">
      <div className="flex">
      <GiHamburgerMenu color="white" size={40} />
      </div>
      <div className="text-white uppercase font-thin">
      Cargando ...
      </div>

      <div className="justify-end">
        <div className="flex justify-between">

          <div className="mr-2">
            <span className="clickeable text-white"><span><AiOutlineSearch size={24} /></span></span>
          </div>

          <div className="ml-2">
            <span className="clickeable text-white"><span><AiFillHome size={24} /></span></span>
          </div>
          
        </div>
      </div>
    </nav>
  </header>
  );
}
