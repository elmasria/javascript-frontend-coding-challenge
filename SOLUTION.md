# Solution Docs

## Implementing Http Endpoint

The user now can use an `HTTP` endpoint as a data source. 

**NB: Knowing that we could use the `data`  parameter as an `HTTP` endpoint also. I have changed that to an `endPoint` parameter so this will be more clear for the user**

### Example of an endPoint data source:

```

new Autocomplete(document.getElementById('gh-user'), {
  endPoint: "https://api.github.com/search/users?q={query}&per_page={numOfResults}",
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});


```

### Sescription:

`{query}` and `{numOfResults}` will be replaced with the values based on user input and the initial `numOfResults`.

Now if you type `foo` in the input, the component dropdown shows *Github* users with logins that contain with `foo`.



##  Implementing keyboard shortcuts

The user now can use the **up**, **down** and **Tab** `keys` to navigate the results drop-down.

### Details

Navigating the results lead to having focus style on elements current navigated element. and if user click `Enter` or the `mouse click` the item will be styled as active element and show the selected item in a search field.