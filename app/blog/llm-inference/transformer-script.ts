export const layerCount = 32;

export const transformerScenes = [
  {
    title: "Text becomes token IDs",
    phase: "Prefill",
    visual: "input",
    seconds: 4,
    detail:
      "The tokenizer turns the prompt into IDs. The embedding table looks up a vector for each position. The five illustrated positions enter layer 01 together.",
  },
  {
    title: "Inside a layer · Build Q, K and V",
    phase: "Prefill",
    visual: "attention",
    seconds: 6,
    detail:
      "After normalization, learned projections turn every input vector into a query, key and value. In this Llama-style example, rotary position embeddings rotate queries and keys using their token positions.",
  },
  {
    title: "Inside a layer · Mask, mix and transform",
    phase: "Prefill",
    visual: "write",
    seconds: 7,
    detail:
      "Each query scores keys up to its own position. The causal mask blocks future positions, and softmax weights the allowed values. The layer saves its K and V vectors. Attention and a feed-forward network update the hidden states through residual connections.",
  },
  {
    title: "Prefill moves through all 32 layers",
    phase: "Prefill",
    visual: "stack",
    seconds: 8,
    detail:
      "The entire prompt's hidden states move from one layer to the next. Each layer uses its own weights and writes its own cache. Prompt positions can be processed together within a layer, while layer outputs feed the next layer in order.",
  },
  {
    title: "The first token is sampled",
    phase: "Prefill",
    visual: "output",
    seconds: 5,
    detail:
      "After the final normalization, the language-model head turns the last prompt position's hidden state into vocabulary scores called logits. The sampler chooses “Moving,” and the server streams it to the client.",
  },
  {
    title: "Decode feeds back just “Moving”",
    phase: "Decode",
    visual: "input",
    seconds: 4,
    detail:
      "“Moving” becomes the next input position. Its hidden state enters layer 01. The cached keys and values already represent the five prompt positions in every layer.",
  },
  {
    title: "Read old KV and append one new position",
    phase: "Decode",
    visual: "read",
    seconds: 7,
    detail:
      "The layer computes a new Q, K and V for “Moving.” Its query attends to the cached prompt K/V and its own new K/V. The cache appends the new position at this layer. The feed-forward network only processes the current hidden state.",
  },
  {
    title: "The new position crosses all 32 layers",
    phase: "Decode",
    visual: "stack",
    seconds: 8,
    detail:
      "Layer 02 receives layer 01's output, and the same pattern continues through layer 32. Old positions contribute via each layer's cache. Their hidden states do not go through the stack again.",
  },
  {
    title: "Stream “model” and repeat",
    phase: "Decode",
    visual: "output",
    seconds: 5,
    detail:
      "The head scores the vocabulary again and the sampler picks “model.” That token becomes input on the following pass. Each pass updates the cache until a stop condition ends generation.",
  },
] as const;

export const sceneStarts = transformerScenes.map((_, index) =>
  transformerScenes
    .slice(0, index)
    .reduce((elapsed, scene) => elapsed + scene.seconds, 0),
);
export const movieLength = transformerScenes.reduce(
  (elapsed, scene) => elapsed + scene.seconds,
  0,
);
