// At 3:33 in Final Video

Vue.component('productDetails', {
    template: `<ul><li v-for="detail in details">{{ detail }}</li></ul>`,
    data() {
        return {
            details: ["80% cotton", "20% polyester", "Gender-neutral"]
        }}
})


Vue.component('product', {
    // Global data props can be passed in
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

    <div class="product-image">
        <img v-bind:src="image" />
    </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <span v-show="onSale" :class="{ onSale: onSale }">On Sale!</span>

            <p v-if="inStock && !runningLow" :class="{ inStock: true }">[{{ variantCount }}] In Stock</p>
            <p v-else-if="runningLow && inStock" :class="{ limitedSupply: true }">[{{variantCount}}] Limited!</p>
            <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
            <p>Shipping: {{ shipping }}</P>
            <!--productDetails Component-->
            <productDetails></productDetails>

            <!--Disable cart and cart button when no in stock-->
            <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
            </div><br>

            <div class="cartButtons">
                <button v-on:click="addToCart" :disabled="(inStock == false)"
                    :class="{ disabledButton: (inStock == false) }">Add to Cart</button>
                <button class="empty" v-on:click="clearCart">Clear Cart</button>
            </div>
        </div>
        <div class="review-comp">
        <product-tabs :reviews="reviews"></product-tabs>
        </div>

</div>
`,
    // // Data was converted from Data Object to Data Function to allow for use in multiple places
    data() {
        return {
            product: 'Socks',
            brand: 'VueJS',
            selectedVariant: 0,
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: "Green",
                    variantImage: './images/vmSocks-green.jpg',
                    variantQuantity: 12
                    },
                    {
                    variantId: 2235,
                    variantColor: "Blue",
                    variantImage: './images/vmSocks-blue.jpg',
                    variantQuantity: 9
                    }
            ],
            reviews: []
        }
    },
    // // Methods (ES6 Syntax)
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
        clearCart() {
            this.$emit('clear-cart', this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    // // Computed Properties (Updates when dependancies change)
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            if (this.variants[this.selectedVariant].variantQuantity > 0) {
                return inStock = true
            }
            return inStock = false
        },
        runningLow() {
            if (this.variants[this.selectedVariant].variantQuantity > 0 && this.variants[this.selectedVariant].variantQuantity < 10) {
                return runningLow = true
            }
            return runningLow = false
        },
        variantCount() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return '$2.99'
        }
    }
})

Vue.component('product-review', {
    // v-model="Data Property for 2-way binding"
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul class="error-log">
            <li v-for="error in errors">{{error}}</li>
        </ul>
    </p>
        
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>
    
    </form>
        `,
    // Component Data
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null,
                this.review = null,
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name Required")
                if(!this.review) this.errors.push("Review Required")
                if(!this.rating) this.errors.push("Rating Required")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <span class="tab"
        :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}</span>

        <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews for this product yet.</p>
        <ul class="review-list">
            <li v-for="review in reviews">
            <p><b>{{ review.name }}</b></p>
            <p>Rating: {{ review.rating }}/5</p>
            <p>{{ review.review }}</p>
            </li>
        </ul>

        
        
        <product-review @review-submitted="addReview"></product-review>
        </div>
    </div>
    
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

// Calling Vue Instance
var app = new Vue({
    el: '#app',
    // Global Variables can be passed into component as a prop
    data: {
        premium: true,
        cart: []
    },
    methods: {
    updateCart(id) {
        this.cart.push(id)
    },
    zeroCart() {
        this.cart = []
    }
}
})