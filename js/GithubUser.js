export class GithubUser {
  static async search(username) {
    const endpoint = `https://api.github.com/users/${username}`
    const user = await fetch(endpoint)
    return await user.json()
  }
}
