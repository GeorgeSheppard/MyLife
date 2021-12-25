import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useCallback, createRef, MouseEvent } from "react";
import {
  CanvasScreenshotter,
  ICanvasScreenshotterRef,
} from "../../components/canvas_screenshotter";
import Model from "../../components/printing/model";
import { GetServerSideProps } from "next";
import { loadModel } from "../../components/printing/model_loader";
import { KeyboardArrowDown } from "@mui/icons-material";
import { PreviewPopper } from "../../components/printing/preview_popper";
import { IPreviewCardProps } from "../../components/cards/preview_card";

export interface IPreview {
  /**
   * Group is passed through props as json
   */
  model: any;
  /**
   * UUID corresponding to the model entry, will be empty if it's new
   */
  uuid: string;
}

export default function Preview(props: IPreview) {
  const screenshotRef = createRef<ICanvasScreenshotterRef>();
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // TODO: Remove this awful hack, 48px is two times the padding on either side
  const canvasSideLength = `min(calc(100vh - ${headerHeight}px), 100vw - 48px)`;

  const takeCanvasScreenshot = useCallback(() => {
    if (screenshotRef.current) {
      const screenshot = screenshotRef.current.takeScreenshot();
      setScreenshot(screenshot);
    }
  }, [screenshotRef, setScreenshot]);

  // Really moans if you put the actual event type of MouseEvent<SVGSVGElement>
  const handlePopperClick = (event: MouseEvent<any>) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
      if (!popperOpen) {
        takeCanvasScreenshot();
      }
      setPopperOpen((prevState) => !prevState);
    }
  };

  return (
    <Container maxWidth={false}>
      <Box
        component="div"
        sx={{
          pt: "24px",
          height: canvasSideLength,
          width: canvasSideLength,
          margin: "auto",
        }}
      >
        <KeyboardArrowDown
          component="svg"
          sx={{
            position: "relative",
            left: `calc(${canvasSideLength} / 2 - 12px)`,
          }}
          onClick={handlePopperClick}
        />
        {anchorEl && screenshot && (
          <PreviewPopper
            open={popperOpen}
            anchorEl={anchorEl}
            screenshot={screenshot}
            uuid={props.uuid}
          />
        )}
        <Canvas
          resize={{
            debounce: 0,
            scroll: false,
          }}
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0.5, 0.5, 4], fov: 50 }}
          dpr={window.devicePixelRatio}
        >
          <CanvasScreenshotter ref={screenshotRef} />
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model model={props.model} />
        </Canvas>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<IPreview> = async (
  context
) => {
  const path = context.query.writePath;

  if (!path || path instanceof Array) {
    return {
      redirect: {
        destination: "/printing",
        permanent: false,
      },
    };
  }

  let model;
  try {
    model = await loadModel(path);
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: "/printing",
        permanent: false,
      },
    };
  }

  return {
    props: {
      model: model.toJSON(),
      // I would prefer to return possibly undefined, but this crashes if you do that
      uuid: context.query.uuid as any as string,
    },
  };
};
