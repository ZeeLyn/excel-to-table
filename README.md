# rest.request
 
## Configuration
Add .env.dev file
```
NODE_ENV = 'development'
VITE_APP_API_BASE_URL = 'development domain'
```

Add .env.prod file
```
NODE_ENV = 'production'
VITE_APP_API_BASE_URL = 'production domain'
```

## Usage
### 1.Modify main.js
```javascript
import request from "@g1100100/rest.request"
Vue.prototype.$http = request;
```

### 2.Configure default options
```javascript
request.defaults({

})

```

### 3.Request api
```javascript
this.$http.post("url",{
    data:{
        name:"test"
    }
}).then(res=>{
    console.inf(res.data);
});
```

## Options
|Option|Type|Description|
|--|--|--|
|$400|function|Called when the response status code is 400|
|$401|function|Called when the response status code is 401|
|$403|function|Called when the response status code is 403|
|$404|function|Called when the response status code is 404|
|$catch|function|Called when the response status code is not in the above list|
|$finally|function|No matter what the response result is, it will be called|