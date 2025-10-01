// components/InnerBanner.jsx
import defaultImg from "../assets/images/heading-background.png";

export default function InnerBanner({ title, image }) {
    const bgImage = image ? image : defaultImg;
    return (
        <section
            className="InnerBanner bg-white py-10 sm:py-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="h-[200px]  mx-auto sm:px-7 px-4 max-w-screen-xl flex items-center">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl  text-white font-bold">
                    {title}
                </h1>
            </div>
        </section>
    );
}
