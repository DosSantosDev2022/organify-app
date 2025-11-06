import { ThemeButton } from "./ThemeButton"

const Header = () => {
  return (
    <header className="mb-8 border-b pb-0.5">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Organify App</h1>
          <p className="text-muted-foreground">
            Organize suas receitas, despesas e investimentos
          </p>
        </div>

        <ThemeButton />
      </div>
    </header>
  )
}

export { Header }