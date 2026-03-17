export function NeonHeading({ children }:{children:React.ReactNode}) {
  return <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-primary to-purple-600 dark:from-indigo-400 dark:via-cyan-300 dark:to-purple-500 font-black tracking-tight">{children}</h2>
}