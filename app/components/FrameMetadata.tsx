import Script from 'next/script';

export default function FrameMetadata() {
    return (
        <>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://oreemo.xyz/api/image?path=/" />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:post_url" content="https://oreemo.xyz/api/" />
            <meta property="fc:frame:button:1" content="Start" />
            <meta property="og:image" content="https://oreemo.xyz/api/image?path=/" />
        </>
    );
}
