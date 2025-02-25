// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { fromSec } from "@foxglove/rostime";
import { MessageEvent, Topic } from "@foxglove/studio";
import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";

import ThreeDeeRender from "../index";
import { TransformStamped } from "../ros";
import { makePass, QUAT_IDENTITY, TEST_COLORS } from "./common";
import useDelayedFixture from "./useDelayedFixture";

const VEC3_ZERO = { x: 0, y: 0, z: 0 };

export default {
  title: "panels/ThreeDeeRender",
  component: ThreeDeeRender,
};

TransformInterpolation.parameters = { colorScheme: "dark" };
export function TransformInterpolation(): JSX.Element {
  const topics: Topic[] = [
    { name: "/markers", datatype: "visualization_msgs/Marker" },
    { name: "/tf", datatype: "geometry_msgs/TransformStamped" },
  ];
  const tf_t1: MessageEvent<TransformStamped> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 1, nsec: 0 }, frame_id: "map" },
      child_frame_id: "base_link",
      transform: {
        translation: VEC3_ZERO,
        rotation: QUAT_IDENTITY,
      },
    },
    sizeInBytes: 0,
  };
  const tf_t3: MessageEvent<TransformStamped> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 3, nsec: 0 }, frame_id: "map" },
      child_frame_id: "base_link",
      transform: {
        translation: { x: 2, y: 0, z: 0 },
        rotation: QUAT_IDENTITY,
      },
    },
    sizeInBytes: 0,
  };
  const pass1 = makePass({
    id: 1,
    frame_id: "base_link",
    stamp: fromSec(1),
    colorHex: TEST_COLORS.MARKER_GREEN1,
  });
  const pass2 = makePass({
    id: 2,
    frame_id: "base_link",
    stamp: fromSec(1),
    colorHex: TEST_COLORS.MARKER_GREEN2,
    frame_locked: true,
  });
  const pass3 = makePass({
    id: 3,
    frame_id: "base_link",
    stamp: fromSec(2),
    colorHex: TEST_COLORS.MARKER_GREEN3,
    pose: { position: { x: 1, y: 0, z: 0 }, orientation: QUAT_IDENTITY },
  });

  const fixture = useDelayedFixture({
    topics,
    frame: {
      "/markers": [pass1, pass2, pass3],
      "/tf": [tf_t1, tf_t3],
    },
    capabilities: [],
    activeData: {
      currentTime: { sec: 2, nsec: 0 },
    },
  });

  return (
    <PanelSetup fixture={fixture}>
      <ThreeDeeRender
        overrideConfig={{
          followTf: "base_link",
          layers: {
            grid: {
              layerId: "foxglove.Grid",
              position: [0, 0, -0.25],
            },
          },
          cameraState: {
            distance: 3,
            perspective: true,
            phi: 1,
            targetOffset: [0, 0, 0],
            thetaOffset: 0,
            fovy: 0.75,
            near: 0.01,
            far: 5000,
            target: [0, 0, 0],
            targetOrientation: [0, 0, 0, 1],
          },
        }}
      />
    </PanelSetup>
  );
}
