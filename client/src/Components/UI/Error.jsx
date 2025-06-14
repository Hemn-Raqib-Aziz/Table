


const Error = ({errors, name}) => {
  return (
    <>
    {errors[name] && 
        <p className="text-red-600 text-xs mt-1">{errors[name]}</p>
    }
    </>
  )
}

export default Error
