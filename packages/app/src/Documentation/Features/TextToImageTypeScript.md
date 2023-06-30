# Text-to-Image

One of the core foundations of our API is the ability to generate images. Check out the examples below to learn how to execute a basic image generation call via our gRPC API.

## TypeScript Example {#typescript-example}

### 1. Copy over the generated client files... {#copy-generated-files}

Follow all the steps [here](/docs/getting-started/typescript-client) to setup the gRPC client and helper functions.

### 2. Make the request... {#make-the-request}

```typescript
import fs from "fs";
import * as Generation from "./generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "./helpers";

const request = buildGenerationRequest("stable-diffusion-xl-1024-v0-9", {
  type: "text-to-image",
  prompts: [
    {
      text: "expansive landscape rolling greens with blue daisies and yggdrasil under a blue alien sky, masterful, ghibli",
    },
  ],
  width: 1024,
  height: 1024,
  samples: 1,
  cfgScale: 8,
  steps: 30,
  seed: 992446758,
  sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
});

executeGenerationRequest(client, request, metadata)
  .then(onGenerationComplete)
  .catch((error) => {
    console.error("Failed to make text-to-image request:", error);
  });
```

### Resulting image written to `image-<seed>.png`:

![Generated image.](/TextToImage-C1.png)

**Note:** This is not representative of all of the parameters available for image generation.

Please check out our [protobuf reference](https://github.com/Stability-AI/api-interfaces/blob/main/src/proto/generation.proto) for a complete list of parameters available for image generation.
