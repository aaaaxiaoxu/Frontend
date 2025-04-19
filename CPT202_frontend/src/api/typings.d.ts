declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseEmailVO_ = {
    code?: number
    data?: EmailVO
    message?: string
  }

  type BaseResponseListMusicFileVO_ = {
    code?: number
    data?: MusicFileVO[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseMusicFile_ = {
    code?: number
    data?: MusicFile
    message?: string
  }

  type BaseResponseMusicFilePlaylistsVO_ = {
    code?: number
    data?: MusicFilePlaylistsVO
    message?: string
  }

  type BaseResponseMusicFileTagCategory_ = {
    code?: number
    data?: MusicFileTagCategory
    message?: string
  }

  type BaseResponseMusicFileVO_ = {
    code?: number
    data?: MusicFileVO
    message?: string
  }

  type BaseResponsePageMusicFile_ = {
    code?: number
    data?: PageMusicFile_
    message?: string
  }

  type BaseResponsePageMusicFileVO_ = {
    code?: number
    data?: PageMusicFileVO_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type EmailRequest = {
    code?: string
    email?: string
  }

  type EmailVO = {
    code?: string
    createTime?: string
    email?: string
    expireTime?: string
    status?: number
    updateTime?: string
  }

  type getMusicFileByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getMusicFileVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPlaylistByCategoryUsingGETParams = {
    /** category */
    category: string
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type listApprovedMusicFilesUsingGETParams = {
    /** current */
    current?: number
    /** pageSize */
    pageSize?: number
  }

  type listPendingMusicFilesUsingGETParams = {
    /** current */
    current?: number
    /** pageSize */
    pageSize?: number
  }

  type listRejectedMusicFilesUsingGETParams = {
    /** current */
    current?: number
    /** pageSize */
    pageSize?: number
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type MusicFile = {
    album?: string
    artist?: string
    bitRate?: number
    category?: string
    coverUrl?: string
    createTime?: string
    duration?: number
    editTime?: string
    fileFormat?: string
    fileSize?: number
    id?: number
    introduction?: string
    isDelete?: number
    name?: string
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    tags?: string
    updateTime?: string
    url?: string
    userId?: number
  }

  type MusicFileEditRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type MusicFilePlaylistsVO = {
    playlists?: Record<string, any>
  }

  type MusicFileQueryRequest = {
    bitRate?: number
    category?: string
    coverId?: number
    current?: number
    duration?: number
    fileFormat?: string
    fileSize?: number
    id?: number
    introduction?: string
    name?: string
    pageSize?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    tags?: string[]
    userId?: number
  }

  type MusicFileReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type MusicFileTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type MusicFileUpdateRequset = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type MusicFileVO = {
    album?: string
    artist?: string
    bitRate?: number
    category?: string
    coverUrl?: string
    createTime?: string
    duration?: number
    editTime?: string
    fileFormat?: string
    fileSize?: number
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
  }

  type PageMusicFile_ = {
    current?: number
    pages?: number
    records?: MusicFile[]
    size?: number
    total?: number
  }

  type PageMusicFileVO_ = {
    current?: number
    pages?: number
    records?: MusicFileVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type streamAudioUsingGETParams = {
    /** id */
    id: number
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadMusicFileUsingPOSTParams = {
    coverUrl?: string
    id?: number
  }

  type User = {
    banReason?: string
    createTime?: string
    editTime?: string
    email?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
    user_status?: number
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserBanRequest = {
    banReason?: string
    id?: number
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    code?: string
    email?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
    user_status?: number
  }

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
