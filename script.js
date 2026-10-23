// ================= نظام الحماية والترحيب الفوري =================
// حماية صفحة المنتجات: لو حاول شخص الدخول لصفحة crud.html مباشرة بدون تسجيل، يتم طرده لصفحة الدخول index.html
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; 
}

// جلب اسم المستخدم المحفوظ من الإيميل وعرضه في كود الترحيب الخاص بك
let activeUser = localStorage.getItem('loggedInUser');
let hiMas = document.getElementById('hiMas');
if (hiMas && activeUser) {
    hiMas.innerHTML = "What's new, " + activeUser;
}

// برمجة زر تسجيل الخروج (Logout) الآمنة
let logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.onclick = function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html'; 
    }
}

// ربط زر إعادة تعيين الاسم برمجياً لمنع الأخطاء
let resetBtn = document.getElementById('reset');
if (resetBtn) {
    resetBtn.onclick = function() {
        let newName = prompt('So, what is your new name?');
        if (newName) {
            localStorage.setItem('loggedInUser', newName);
            if (hiMas) hiMas.innerHTML = "What's new, " + newName;
        }
    }
}

// ================= محرك الـ CRUD الخاص بالمنتجات =================
let title = document.getElementById('title'); 
let price = document.getElementById('price'); 
let taxes = document.getElementById('taxes'); 
let ads = document.getElementById('ads'); 
let discount = document.getElementById('discount'); 
let total = document.getElementById('total'); 
let count = document.getElementById('count'); 
let category = document.getElementById('category'); 
let submit = document.getElementById('submit'); 
let review = document.getElementById('review'); 

let mood = 'create'; 
let tmp; 

// بقية الكود الخاص بك يستمر هنا بالأسفل بشكل طبيعي وسيعمل بنجاح 100%...


// حساب الإجمالي
function get_total(){
    if(price.value != ''){
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    }else{
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

// جلب البيانات المخزنة للمنتجات
let datapro = localStorage.prodact ? JSON.parse(localStorage.prodact) : [];

// إنشاء وتعديل منتج
submit.onclick = function(){
    let newpro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
        review: review.value.trim() || 'no review'
    }

    if(title.value != '' && price.value != '' && category.value != ''){
        if(mood === 'create' ){
            if(newpro.count > 1 && newpro.count < 501){
                for(let i = 0; i < newpro.count; i++){
                    datapro.push(JSON.parse(JSON.stringify(newpro))); 
                }
            }else{
                datapro.push(newpro);
            }
        }else{
            datapro[tmp] = newpro;
            mood = 'create';
            count.style.display = 'block';
            submit.innerHTML = 'create';
        }
        clear_data();
        localStorage.setItem('prodact', JSON.stringify(datapro));
        show_data();
    } else {
        alert('Please fill Title, Price, and Category!');
    }
}

// تنظيف الحقول
function clear_data(){
    title.value = '';
    price.value = '';
    taxes.value = '';
    discount.value = '';
    category.value = '';
    count.value = '';
    ads.value = '';
    total.innerHTML = '';
    review.value = '';
    total.style.background = '#a00d02';
}

// عرض البيانات في الجدول
function show_data(){
    let table = '';
    for(let i = 0; i < datapro.length; i++){
        table += `
        <tr>
            <td>${i+1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td>${datapro[i].review}</td>
            <td><button onclick="updatedata(${i})" id="update">update</button></td>
            <td><button onclick="delete_data(${i})" id="delete">delete</button></td>
        </tr>`;
    }
    
    document.getElementById('tbody').innerHTML = table;
    let btn_del_all = document.getElementById('deleteAll');
    
    if(datapro.length > 0){
        btn_del_all.innerHTML = `<button onclick="delete_all_data()">delete all (${datapro.length})</button>`;
    }else{
        btn_del_all.innerHTML = '';
    }
}
show_data();

// الحذف عنصر واحد
function delete_data(i) {
    datapro.splice(i,1);
    localStorage.prodact = JSON.stringify(datapro);
    show_data();
}

// حذف الكل بدون تدمير بيانات حسابات الدخول
function delete_all_data(){
    if(confirm('Are you sure you want to delete all products?')){
        datapro.splice(0);
        localStorage.removeItem('prodact'); 
        show_data();
    }
}

// التحديث
function updatedata(i){
    tmp = i;
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    category.value = datapro[i].category;
    review.value = datapro[i].review === 'no review' ? '' : datapro[i].review;
    
    count.style.display = 'none';
    submit.innerHTML = 'update';
    mood = 'update';
    
    scroll({ top:0, behavior:'smooth' });
    get_total();
}

// البحث
let searchmood = 'title';
function getsearchmood(id){
    let search = document.getElementById('search');
    searchmood = (id == 'searchTitle') ? 'title' : 'category';
    search.focus();
    search.placeholder = 'search by ' + searchmood;
    search.value = '';
    show_data();
}

function searchdata(value){
    let table = '';
    let val = value.toLowerCase();
    for(let i = 0; i < datapro.length; i++){
        let match = (searchmood === 'title') ? datapro[i].title.includes(val) : datapro[i].category.includes(val);
        if(match){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].taxes}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>
                <td>${datapro[i].category}</td>
                <td>${datapro[i].review}</td>
                <td><button onclick="updatedata(${i})" id="update">update</button></td>
                <td><button onclick="delete_data(${i})" id="delete">delete</button></td>
            </tr>`;
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// التقارير والتصدير
function printProducts() { window.print(); }

function exportToExcel() {
    if (datapro.length === 0) {
        alert("لم يتم العثور على منتجات لتصديرها!");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,\uFEFFID;TITLE;PRICE;TAXES;ADS;DISCOUNT;TOTAL;CATEGORY;REVIEW\n";
    for (let i = 0; i < datapro.length; i++) {
        let row = `${i + 1};${datapro[i].title};${datapro[i].price};${datapro[i].taxes};${datapro[i].ads};${datapro[i].discount};${datapro[i].total};${datapro[i].category};${datapro[i].review}`;
        csvContent += row + "\n";
    }
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
