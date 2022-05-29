import { defineInterface } from '@directus/shared/utils';
import InterfaceFileVideo from './file-video.vue';

export default defineInterface({
	id: 'file-video',
	name: '视频文件',
	description: '视频文件',
	icon: 'insert_photo',
	component: InterfaceFileVideo,
	types: ['uuid'],
	localTypes: ['file'],
	group: 'relational',
	relational: true,
	options: [
		{
			field: 'folder',
			name: '$t:interfaces.system-folder.folder',
			type: 'uuid',
			meta: {
				width: 'half',
				interface: 'system-folder',
				note: '$t:interfaces.system-folder.field_hint',
			},
			schema: {
				default_value: undefined,
			},
		}
	],
	recommendedDisplays: ['file']
});
