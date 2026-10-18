import usersModel from "../../DB/models/users.model.js"

export const signUP = async (req, res) => {
    try {
        const { name, email, password, age, phone } = req.body

        if (!name || !email || !password || !age || !phone) {
            return res.status(400).json({ message: "you should give me all (name , email , password , age , phone)" })
        }

        const user = await usersModel.findOne({ email })

        if (user) {

            return res.status(400).json({ message: "user already exist" })

        }

        const finalUser = await usersModel.create({ name, email, password, age, phone })


        return res.status(200).json({ message: "user created succefully", finalUser })

    } catch (error) {
        return res.status(500).json({ message: "erorr in api", error })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "you should give me all (email , password)" })
        }

        const user = await usersModel.findOne({ email })


        if (!user || user.password !== password) {

            return res.status(400).json({ message: "invalid email or password" })

        }

        return res.status(200).json({ message: "user logged in successfully" })

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

export const updateUserData = async (req, res) => {
    try {

        const { id } = req.params
        const { name, email, age, phone } = req.body

        const isUserExist = await usersModel.findOne({ email })

        if (isUserExist) {
            return res.status(400).json({ message: "user Email was existed before" })
        }

        if (!name || !email || !age || !phone || !id) {
            return res.status(400).json({ message: "you should give me all (name , email , age , phone , id)" })
        }

        const user = await usersModel.findByIdAndUpdate(id, { name, email, age, phone }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "user updated successfully", user })

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}

export const deleteUser = async (req, res) => {
    try {

        const { id } = req.params

        const user = await usersModel.deleteOne({ _id: id })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "user deleted successfully", user })

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}   



export const getUser = async (req, res) => {
    try {

        const { id } = req.params

        const user = await usersModel.findOne({ _id: id })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ message: "user retrieved successfully", user })

    } catch (error) {
        return res.status(500).json({ message: "error in api", error })
    }
}   


