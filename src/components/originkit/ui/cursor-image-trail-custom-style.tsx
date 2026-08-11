// Originkit preset `custom-style` — props baked into the default export.
"use client";

import * as React from "react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

const DEFAULT_URLS = [
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749553/polacraft/products/gallery/ylrnc645hbsdz0qtzbso.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749525/polacraft/products/gallery/zvowpdluf7wwvni0mbsk.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749422/polacraft/products/gallery/rjszdp0hyjynj6mftfxl.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749368/polacraft/products/gallery/mgm8rfvwo5cdcao5gk7g.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749285/polacraft/products/gallery/jsvcud6oaxqmk3ciihiy.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749266/polacraft/products/gallery/ojpytfw4bn0abvn9mrye.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749228/polacraft/products/gallery/khtsmcgfwsg62mhatcrd.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749191/polacraft/products/gallery/mxtml0xdyif5auglh2nc.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749149/polacraft/products/gallery/pp8b5f2rvsiuyhcgxsej.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749103/polacraft/products/gallery/esjf6auafqj2wu1wiodk.jpg"
];

const TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

const srcOf = (img: any): string =>
    typeof img === "string" ? img : (img?.src ?? "");

interface Props {
    images: any[];
    imageWidth: number;
    imageHeight: number;
    radius: number;
    fit: "cover" | "contain";
    position: "top" | "center" | "bottom";
    frequency: number;
    visibleFor: number;
    showLabel: boolean;
    labelText: string;
    labelColor: string;
    labelFont: CSSProperties;
}

function OriginkitBaseCursorImageTrail(props: Partial<Props> & { [k: string]: any }) {
    const {
        images = DEFAULT_URLS,
        imageWidth = 100,
        imageHeight = 100,
        radius = 0,
        fit = "cover",
        position = "center",
        frequency = 35,
        visibleFor = 1,
        showLabel = true,
        labelText = "Hover Me",
        labelColor = "#ffffff",
        labelFont = {
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 60,
            lineHeight: "1.5em",
            letterSpacing: "0em",
            textAlign: "left",
        },
        ...rest
    } = props;

    const urls = useMemo(() => {
        const list = (images ?? []).map(srcOf).filter(Boolean);
        return list.length ? list : DEFAULT_URLS;
    }, [images]);

    const threshold = 200 - ((frequency - 1) * 199) / 49;

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeImages, setActiveImages] = useState<any[]>([]);

    const handleMouseMove = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
        setIsHovering(true);
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!isHovering || urls.length === 0) return;
        const lastPos = lastPosRef.current;
        const distance = lastPos
            ? Math.hypot(mousePos.x - lastPos.x, mousePos.y - lastPos.y)
            : Infinity;
        if (distance <= threshold) return;

        lastPosRef.current = { x: mousePos.x, y: mousePos.y };

        const newImage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            position: currentImageIndex,
            x: mousePos.x,
            y: mousePos.y,
            state: "entering",
        };
        setActiveImages((prev) => [...prev, newImage]);
        setCurrentImageIndex((prev) => (prev + 1) % urls.length);

        const t1 = setTimeout(() => {
            setActiveImages((prev) =>
                prev.map((img) =>
                    img.id === newImage.id ? { ...img, state: "exiting" } : img
                )
            );
        }, visibleFor * 1000);

        const t2 = setTimeout(
            () => {
                setActiveImages((prev) =>
                    prev.filter((img) => img.id !== newImage.id)
                );
            },
            visibleFor * 1000 + 500
        );

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
    }, [mousePos, isHovering, urls, threshold, currentImageIndex, visibleFor]);

    return (
        <div
            {...rest}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                ...rest.style,
            }}
        >
            {showLabel && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        userSelect: "none",
                        ...labelFont,
                        color: labelColor,
                    }}
                >
                    {labelText}
                </div>
            )}

            {activeImages.map(({ id, position: slot, x, y, state }) => (
                <motion.div
                    key={id}
                    initial={{
                        opacity: 0,
                        scale: 0.5,
                        filter: "blur(10px)",
                        x: x - imageWidth / 2,
                        y: y - imageHeight / 2,
                    }}
                    animate={{
                        opacity: state === "entering" ? 1 : 0,
                        scale: state === "entering" ? 1 : 0.5,
                        filter:
                            state === "entering" ? "blur(0px)" : "blur(10px)",
                        x: x - imageWidth / 2,
                        y: y - imageHeight / 2,
                    }}
                    transition={TRANSITION}
                    style={{
                        position: "absolute",
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                        backgroundImage: `url(${urls[slot]})`,
                        backgroundSize: fit,
                        backgroundPosition:
                            fit === "cover" ? `center ${position}` : "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: `${radius}px`,
                        pointerEvents: "none",
                    }}
                />
            ))}
        </div>
    );
}

const __originkitPresetProps = {
  "images": [
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749553/polacraft/products/gallery/ylrnc645hbsdz0qtzbso.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749525/polacraft/products/gallery/zvowpdluf7wwvni0mbsk.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749422/polacraft/products/gallery/rjszdp0hyjynj6mftfxl.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749368/polacraft/products/gallery/mgm8rfvwo5cdcao5gk7g.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749285/polacraft/products/gallery/jsvcud6oaxqmk3ciihiy.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749266/polacraft/products/gallery/ojpytfw4bn0abvn9mrye.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749228/polacraft/products/gallery/khtsmcgfwsg62mhatcrd.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749191/polacraft/products/gallery/mxtml0xdyif5auglh2nc.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749149/polacraft/products/gallery/pp8b5f2rvsiuyhcgxsej.jpg",
    "https://res.cloudinary.com/virvu4jm/image/upload/f_auto,q_auto,w_320/v1785749103/polacraft/products/gallery/esjf6auafqj2wu1wiodk.jpg"
  ],
  "imageWidth": 150,
  "imageHeight": 200,
  "radius": 4,
  "fit": "cover",
  "position": "center",
  "frequency": 44,
  "visibleFor": 0.3,
  "showLabel": true,
  "labelText": "POLACRAFT",
  "labelColor": "#FFFFFF",
  "labelFont": {
    "variant": "Regular",
    "fontSize": 60,
    "textAlign": "left",
    "fontFamily": "Archivo Black",
    "fontWeight": 400,
    "lineHeight": "1.5em",
    "letterSpacing": "0em"
  }
};

export default function CursorImageTrail(props: Record<string, unknown>) {
  return <OriginkitBaseCursorImageTrail {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
