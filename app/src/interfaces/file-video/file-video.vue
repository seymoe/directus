<template>
	<div class="image" :class="[width]">
		<v-skeleton-loader v-if="loading" type="input-tall" />

		<v-notice v-else-if="disabled && !image" class="disabled-placeholder" center icon="block">
			{{ t('disabled') }}
		</v-notice>

		<div v-else-if="image" class="image-preview">
			<div v-if="imageError" class="image-error">
				<v-icon large :name="imageError === 'UNKNOWN' ? 'error_outline' : 'info_outline'" />

				<span class="message">
					{{ t(`errors.${imageError}`) }}
				</span>
			</div>
			<video controls v-else :src="src" alt="" role="presentation" @error="imageErrorHandler" />


			<div v-if="!disabled" class="actions">
				<!-- <v-button v-tooltip="t('zoom')" icon rounded @click="lightboxActive = true">
					<v-icon name="zoom_in" />
				</v-button>
				<v-button v-tooltip="t('download')" icon rounded :href="downloadSrc" :download="image.filename_download">
					<v-icon name="get_app" />
				</v-button> -->
				<v-button v-tooltip="t('edit')" icon rounded @click="editDrawerActive = true">
					<v-icon name="open_in_new" />
				</v-button>
				<v-button v-tooltip="t('deselect')" icon rounded @click="deselect">
					<v-icon name="close" />
				</v-button>
			</div>

			<div class="info">
				<div class="title">{{ image.title }}</div>
				<div class="meta">{{ meta }}</div>
			</div>

			<drawer-item
				v-if="!disabled && image"
				v-model:active="editDrawerActive"
				collection="directus_files"
				:primary-key="image.id"
				:edits="edits"
				@input="stageEdits"
			/>

			<file-lightbox :id="image.id" v-model="lightboxActive" />
		</div>
		<v-upload v-else from-library from-url :folder="folder" @input="setImage" />
	</div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { defineComponent, ref, watch, computed } from 'vue';
import api from '@/api';
import formatFilesize from '@/utils/format-filesize';
import FileLightbox from '@/views/private/components/file-lightbox';
import { getRootPath } from '@/utils/get-root-path';
import { unexpectedError } from '@/utils/unexpected-error';
import { addTokenToURL } from '@/api';
import DrawerItem from '@/views/private/components/drawer-item';

export default defineComponent({
	components: { FileLightbox, DrawerItem },
	props: {
		value: {
			type: [String, Object],
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		folder: {
			type: String,
			default: undefined,
		},
		width: {
			type: String,
			required: true,
		}
	},
	emits: ['input'],
	setup(props, { emit }) {
		const { t, n, te } = useI18n();

		const loading = ref(false);
		const image = ref(null);
		const lightboxActive = ref(false);
		const editDrawerActive = ref(false);
		const imageError = ref(null);

		const src = computed(() => {
			if (!image.value) return null;

			if (image.value.type.includes('mp4')) {
				return addTokenToURL(getRootPath() + `assets/${image.value.id}`);
			}

			return null;
		});

		const downloadSrc = computed(() => {
			if (!image.value) return null;
			return addTokenToURL(getRootPath() + `assets/${image.value.id}`);
		});

		const meta = computed(() => {
			if (!image.value) return null;
			const { filesize, width, height, type } = image.value;

			if (width && height) {
				return `${n(width)}x${n(height)} • ${formatFilesize(filesize)} • ${type}`;
			}

			return `${formatFilesize(filesize)} • ${type}`;
		});

		watch(
			() => props.value,
			(newValue, oldValue) => {
				if (newValue === oldValue) return;

				if (newValue) {
					fetchImage();
				}

				if (oldValue && newValue === null) {
					deselect();
				}
			},
			{ immediate: true }
		);

		const { edits, stageEdits } = useEdits();

		return {
			t,
			loading,
			image,
			src,
			imageError,
			imageErrorHandler,
			meta,
			lightboxActive,
			editDrawerActive,
			setImage,
			deselect,
			downloadSrc,
			edits,
			stageEdits,
		};

		async function fetchImage() {
			loading.value = true;

			try {
				const id = typeof props.value === 'string' ? props.value : props.value?.id;

				const response = await api.get(`/files/${id}`, {
					params: {
						fields: ['id', 'title', 'width', 'height', 'filesize', 'type', 'filename_download'],
					},
				});

				if (props.value !== null && typeof props.value === 'object') {
					image.value = {
						...response.data.data,
						...props.value,
					};
				} else {
					image.value = response.data.data;
				}
			} catch (err) {
				unexpectedError(err);
			} finally {
				loading.value = false;
			}
		}

		async function imageErrorHandler() {
			if (!src.value) return;
			try {
				await api.get(src.value);
			} catch (err) {
				imageError.value = err.response?.data?.errors[0]?.extensions?.code;

				if (!imageError.value || !te('errors.' + imageError.value)) {
					imageError.value = 'UNKNOWN';
				}
			}
		}

		function setImage(data) {
			image.value = data;
			emit('input', data.id);
		}

		function deselect() {
			emit('input', null);

			loading.value = false;
			image.value = null;
			lightboxActive.value = false;
			editDrawerActive.value = false;
		}

		function useEdits() {
			const edits = computed(() => {
				// If the current value isn't a primitive, it means we've already staged some changes
				// This ensures we continue on those changes instead of starting over
				if (props.value && typeof props.value === 'object') {
					return props.value;
				}

				return {};
			});

			return { edits, stageEdits };

			function stageEdits(newEdits) {
				if (!image.value) return;

				emit('input', {
					id: image.value.id,
					...newEdits,
				});
			}
		}
	},
});
</script>

<style scoped>
.image-preview {
	position: relative;
	width: 100%;
	height: var(--input-height-tall);
	overflow: hidden;
	background-color: var(--background-normal-alt);
	border-radius: var(--border-radius);
}

video {
  display: block;
  margin: 0 auto;
	z-index: 1;
	height: 100%;
}

.image-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: var(--foreground-subdued);
	background-color: var(--background-normal);
}
.image-error .v-icon {
	margin-bottom: 6px;
}
.image-error .message {
	max-width: 300px;
	padding: 0 16px;
	text-align: center;
}

.actions {
	--v-button-color: var(--foreground-subdued);
	--v-button-background-color: var(--white);
	--v-button-color-hover: var(--foreground-normal);
	--v-button-background-color-hover: var(--white);

	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 3;
	display: flex;
	justify-content: flex-end;
	width: 100%;
}

.actions .v-button {
  margin-right: 12px;
  transform: translateY(10px);
  opacity: 0;
  transition: var(--medium) var(--transition);
  transition-property: opacity transform;
}

.actions .v-button:last-child {
  margin-right: 0px;
}

.info {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 3;
	width: 50%;
	padding: 8px 12px;
	line-height: 1.2;
}

.title {
	color: var(--white);
}

.meta {
	height: 17px;
	max-height: 0;
	overflow: hidden;
	color: rgb(255 255 255 / 0.75);
	transition: max-height var(--fast) var(--transition);
}

.image-preview:focus-within .actions .v-button, .image-preview:hover .actions .v-button {
  transform: translateY(0px);
	opacity: 1;
}
.image-preview:focus-within .meta, .image-preview:hover .meta {
  max-height: 17px;
}

.image.full .image-preview, .image.fill .image-preview{
  height: auto;
	max-height: 400px;
}

.disabled-placeholder {
	height: var(--input-height-tall);
}
</style>
