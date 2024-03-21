import data from "@/data"

export const Cssgrid= () => {

    const style = " bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center ";
    return(
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 auto-rows-[175px] gap-3 my-10">
                {data.map((item, index)=> (
                    <div key={index} className={`${style} ${index=== 3 ?'md:col-span-2':'' }  ${index=== 2||index=== 4 || index=== 5 ? "md col-span-2 row-span-2": ''}`}>
                        <h2 className="text-xl text-gray-600">{item.title}</h2>
                        <p className=" font-bold text-2xl">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}