const InputField = ({ id, value, handleChange }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700">{id}</label>
      <input
        type="text"
        name={id}
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder={`Ingrese ${id}`}
      />
    </div>
  );
};

export default InputField;
