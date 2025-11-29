import { ContributePixModal } from "./ContributePixModal"
import { LogoApp } from "./logo"
import { SideBar } from "./sidebar"
import { ThemeButton } from "./ThemeButton"
import { UserAvatar } from "./UserAvatar"

const Header = () => {
  return (
    <header className="mb-6 sm:mb-8 border-b pb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <LogoApp />
        </div>

        <div className="flex items-center gap-2.5">
          <ContributePixModal />

          <SideBar />
          <ThemeButton />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}

export { Header }