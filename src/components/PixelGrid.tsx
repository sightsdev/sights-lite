import React, {useEffect, useRef} from "react";
// @ts-ignore
import pixelGrid from "pixel-grid";

export const PixelGrid = ({data = [], options = {}, ...props}: {
    data: Array<number>,
    options: any
}) => {
    const grid = useRef<pixelGrid>({});
    const container = useRef<HTMLDivElement>(null);
    const queue = useRef<Array<Array<number>>>([]);

    useEffect(() => {
        grid.current = pixelGrid(data, {
            ...options,
            root: container.current,
        });

        return () => {
            queue.current = [];
            grid.current.canvas && grid.current.canvas.remove();
        };
    }, [...Object.values(options).flat(), data.length]);

    useEffect(() => {
        setTimeout(() => {
            grid.current.frame && grid.current.frame(() => {
                const shifted = queue.current.shift();
                shifted && grid.current.update(shifted);
            });
        }, 0);
    }, []);

    useEffect(() => {
        if (queue.current.length > 30) {
            console.warn("PixelGrid update queue > 30; flushing");
            queue.current = [];
        }
        queue.current.push(data);
    });

    return <div ref={container} {...props} />;
};