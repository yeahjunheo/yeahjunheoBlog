import Image from "next/image";

export default function HeroBanner() {
    return (
        <div className="relative py-20 mb-16 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/DSCF0079.JPG"
                    alt="Background"
                    fill
                    className="object-cover dark:brightness-200 brightness-80"
                    priority
                />
                {/* Theme-aware overlay */}
                <div className="absolute inset-0 bg-black/30 dark:bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg text-cream-light">
                    Hi, I'm <span className="text-yellow">Yeahjun HEO</span>
                </h1>
                <p className="text-2xl text-cream-light max-w-3xl mx-auto">
                    The most irresistible cutie <strong>FAT</strong>ootie you'll ever meet!
                </p>
            </div>
        </div>
    );
}
