// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** listApprovedMusicFiles GET /api/musicfile/admin/list/approved */
export async function listApprovedMusicFilesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listApprovedMusicFilesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMusicFile_>('/api/musicfile/admin/list/approved', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** listPendingMusicFiles GET /api/musicfile/admin/list/pending */
export async function listPendingMusicFilesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPendingMusicFilesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMusicFile_>('/api/musicfile/admin/list/pending', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** listRejectedMusicFiles GET /api/musicfile/admin/list/rejected */
export async function listRejectedMusicFilesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRejectedMusicFilesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMusicFile_>('/api/musicfile/admin/list/rejected', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** deleteMusicFile POST /api/musicfile/delete */
export async function deleteMusicFileUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/musicfile/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editMusicFile POST /api/musicfile/edit */
export async function editMusicFileUsingPost(
  body: API.MusicFileEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/musicfile/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMusicFileById GET /api/musicfile/get */
export async function getMusicFileByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMusicFileByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseMusicFile_>('/api/musicfile/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getMusicFileVOById GET /api/musicfile/get/vo */
export async function getMusicFileVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMusicFileVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseMusicFileVO_>('/api/musicfile/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listMusicFileByPage POST /api/musicfile/list/page */
export async function listMusicFileByPageUsingPost(
  body: API.MusicFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMusicFile_>('/api/musicfile/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMusicFileVOByPage POST /api/musicfile/list/page/vo */
export async function listMusicFileVoByPageUsingPost(
  body: API.MusicFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMusicFileVO_>('/api/musicfile/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPlaylistByCategory GET /api/musicfile/playlist/${param0} */
export async function getPlaylistByCategoryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlaylistByCategoryUsingGETParams,
  options?: { [key: string]: any }
) {
  const { category: param0, ...queryParams } = params
  return request<API.BaseResponseListMusicFileVO_>(`/api/musicfile/playlist/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** getAllPlaylists GET /api/musicfile/playlists */
export async function getAllPlaylistsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMusicFilePlaylistsVO_>('/api/musicfile/playlists', {
    method: 'GET',
    ...(options || {}),
  })
}

/** reviewMusicFile POST /api/musicfile/review */
export async function reviewMusicFileUsingPost(
  body: API.MusicFileReviewRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/musicfile/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** streamAudio GET /api/musicfile/stream/${param0} */
export async function streamAudioUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.streamAudioUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<any>(`/api/musicfile/stream/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** listMusicFileTagCategory GET /api/musicfile/tag_category */
export async function listMusicFileTagCategoryUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMusicFileTagCategory_>('/api/musicfile/tag_category', {
    method: 'GET',
    ...(options || {}),
  })
}

/** updateMusicFile POST /api/musicfile/update */
export async function updateMusicFileUsingPost(
  body: API.MusicFileUpdateRequset,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/musicfile/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadMusicFile POST /api/musicfile/upload */
export async function uploadMusicFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadMusicFileUsingPOSTParams,
  body: {},
  coverFile?: File,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (coverFile) {
    formData.append('coverFile', coverFile)
  }

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponseMusicFileVO_>('/api/musicfile/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
