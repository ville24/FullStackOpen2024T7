import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'

export const getBlogs = () =>
    axios.get(baseUrl).then(res => res.data)

export const createBlog = async (obj) => {
    const config = {
        headers: { Authorization: `Bearer ${obj.user.token}` }
    }
    const response = await axios.post(baseUrl, obj.newBlog, config)
    return response.data
}

export const updateBlog = async (obj) => {
    const id = obj.updateBlog.id
    delete obj.updateBlog.id
    const config = {
        headers: { Authorization: `Bearer ${obj.user.token}` }
    }
    const response = await axios.put(baseUrl + '/' + id, obj.updateBlog, config)
    return response.data
}

export const removeBlog = async (obj) => {
    const config = {
        headers: { Authorization: `Bearer ${obj.user.token}` }
    }
    await axios.delete(baseUrl + '/' + obj.id, config)
}
