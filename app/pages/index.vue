<template>
  <Bounded data-slice-type="slice.slice_type" data-slice-variation="slice.variation">
    <div class="relative text-center">
      <GlideGrid />
      <PrismicText
        class="hero__heading mx-auto max-w-3xl text-balance text-5xl font-medium opacity-0 md:text-7xl"
        wrapper="h1"
      />
      <PrismicText
        class="hero__body mx-auto mt-6 max-w-md text-balance text-gray-300 opacity-0"
        wrapper="p"
      />
      <div class="flex flex-wrap gap-8 justify-center">
        <PrismicLink
          class="hero__button buttonLink mt-8 opacity-0"
        />
      </div>
      <div class="hero__image glass-container mt-16 w-fit opacity-0">
        <div
          class="hero__glow hero__glow--one absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-sky-700/50 opacity-0 mix-blend-screen blur-3xl filter md:blur-[120px]"
        />
        <div
          class="hero__glow hero__glow--two absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-teal-600/50 opacity-0 mix-blend-screen blur-3xl filter md:blur-[120px]"
        />
      </div>
    </div>
  </Bounded>
</template>
