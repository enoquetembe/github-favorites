import { GithubUser } from "./GithubUser.js"

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    this.onAdd()
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem("@githubfavorites:")) || []
  }

  save() {
    localStorage.setItem("@githubfavorites:", JSON.stringify(this.entries))
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
    this.save()
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error("User already exists")
      }

      const user = await GithubUser.search(username)
      const { login, name, followers, public_repos } = user

      if (login === undefined) {
        throw new Error("could not find the username")
      }

      this.entries = [{ login, name, followers, public_repos }, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  onAdd() {
    const buttonAdd = this.root.querySelector(".search button")

    buttonAdd.onclick = () => {
      const { value } = this.root.querySelector(".search input")
      this.add(value)
    }
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.tbody = document.querySelector("table tbody")
    this.update()
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const row = this.createTr()
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`
      row.querySelector(
        ".user img"
      ).alt = `imagem de perfil do github de ${user.name}`
      row.querySelector("a").href = `https://github.com/${user.login}`
      row.querySelector("a p").textContent = user.name
      row.querySelector("a span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Are you sure you want to remove?")
        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  createTr() {
    const tr = document.createElement("tr")
    tr.innerHTML = `<td class="user">
            <img src="https://github.com/enoquetembe.png" alt="enoque's photo">
            <a href="https://github.com/enoquetembe" target="_blank">
              <p>Enoque Tembe</p>
              <span>enoquetembe</span>
            </a>
          </td>
          <td class="repositories"> 19</td>
          <td class="followers"> 19</td>
          <td> <button class="remove">&times;</button> </td>`

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
