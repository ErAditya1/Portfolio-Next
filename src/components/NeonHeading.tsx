export function NeonHeading({ children }:{children:React.ReactNode}) {
  return <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-500">{children}</h2>
}