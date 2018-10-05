## **Grid WidgetHeader component**

> tests data format:

```
{
  name: string,
  description: string,
  shared: boolean,
  owner: string,
  type: string,
  meta: string,
}
```

### Props :

* **intl**: _string_, required,
* **userId**: _string_, required,
* **onRefresh**: _func_, optional, default = () => {},
* **onDelete**: _func_, optional, default = () => {},
* **data**: _object_, optional, default = {},
