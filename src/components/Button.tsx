export const Button = ({color = '', children, ...props}: any) => (
    <button type="button" {...props}
            className={`${color} flex items-center focus:outline-none font-medium rounded-lg text-sm px-4 py-2 tracking-wide capitalize transition-colors duration-300 transform text-center mr-3 md:mr-0`}>
        {children}
    </button>
)