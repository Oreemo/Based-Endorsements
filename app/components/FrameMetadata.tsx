import Script from 'next/script';

export default function FrameMetadata() {
    return (
        <>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:post_url" content="https://oreemo.xyz/api/" />
            <meta property="fc:frame:button:1" content="Start" />
        </>
    );
}
