<script setup lang="ts">
  import { ref } from "vue";

  import { useSeoMeta } from "#imports";

  useSeoMeta({
    title: "rivu - RSS 2.0 Feed Generator for TypeScript",
    description:
      "A lightweight, type-safe RSS 2.0 feed generator for Node.js and modern JavaScript runtimes.",
  });

  const activePackageManager = ref<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
  const copied = ref(false);

  const packageManagers = {
    pnpm: "pnpm add rivu",
    npm: "npm install rivu",
    yarn: "yarn add rivu",
    bun: "bun add rivu",
  };

  function copyCmd(): void {
    navigator.clipboard.writeText(packageManagers[activePackageManager.value]);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30"
  >
    <main class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="space-y-8 text-center">
        <span
          class="inline-flex items-center rounded-md border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
        >
          TypeScript RSS 2.0 Library
        </span>

        <h1
          class="mx-auto max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl"
        >
          Type-safe, lightweight feeds for
          <span
            class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >rivu</span
          >.
        </h1>

        <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
          Robust, 100% compliant RSS 2.0 generator designed with strict
          TypeScript interfaces and high performance for Node.js.
        </p>

        <div
          class="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-2 shadow-xl"
        >
          <div
            class="mb-2 flex items-center justify-center space-x-1 border-b border-slate-800 pb-2"
          >
            <button
              v-for="(cmd, pm) in packageManagers"
              :key="pm"
              @click="activePackageManager = pm"
              :class="[
                'rounded-md px-3 py-1 font-mono text-xs font-medium uppercase transition-colors',
                activePackageManager === pm
                  ? 'border border-slate-700 bg-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200',
              ]"
            >
              {{ pm }}
            </button>
          </div>
          <div
            class="flex items-center justify-between px-3 py-1 font-mono text-sm text-slate-200"
          >
            <span>{{ packageManagers[activePackageManager] }}</span>
            <button
              @click="copyCmd"
              class="text-xs text-slate-400 transition-colors hover:text-indigo-400"
            >
              {{ copied ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:rss" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            RSS 2.0 Compliant
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            100% RSS 2.0 compliant output ready for feed readers and syndication
            channels.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:zap" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Lightweight & Fast
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Lightweight and fast, built specifically optimized for Node.js
            backends.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:shield-check" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Fully Type-Safe
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Fully type-safe architecture using strict TypeScript interfaces.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:list-checks" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Strict Validation
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Strict validation checks for required RSS channel fields before
            generation.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:tag" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Custom Feed Items
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Support for custom feed items packed with rich optional metadata
            attributes.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:feather" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Small Footprint
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Small footprint that runs smoothly in Node.js and alternative
            JavaScript runtimes.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
